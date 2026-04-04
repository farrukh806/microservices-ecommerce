"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { PRODUCT_SERVICE_URL } from "@/lib/config";

interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  addresses: Array<{
    id: string;
    firstName: string;
    lastName: string;
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
  }>;
  _count: { orders: number };
}

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "" });

  const fetchUsers = async (searchQuery = "", pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pageNum));
      params.set("size", "10");
      if (searchQuery) params.set("search", searchQuery);
      
      const res = await fetch(`${PRODUCT_SERVICE_URL}/users?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.items);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(search, page);
  }, [search, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(search, 1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchUsers(search, newPage);
    }
  };

  const handleViewUser = async (userId: string) => {
    try {
      const res = await fetch(`${PRODUCT_SERVICE_URL}/users/${userId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch user");
      const user = await res.json();
      setSelectedUser(user);
      setEditForm({ firstName: user.firstName || "", lastName: user.lastName || "" });
    } catch (err) {
      console.error("Failed to fetch user:", err);
      toast.error("Failed to load user details");
    }
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`${PRODUCT_SERVICE_URL}/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update user");
      setIsEditing(false);
      handleViewUser(selectedUser.id);
      fetchUsers(search, page);
      toast.success("User updated successfully");
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(`${PRODUCT_SERVICE_URL}/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setSelectedUser(null);
      fetchUsers(search, page);
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user");
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsEditing(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Orders</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Joined</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : "No name"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{user._count.orders} orders</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleViewUser(user.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => {
                            handleViewUser(user.id);
                            setTimeout(() => setIsEditing(true), 100);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <div className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">User Details</h2>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Edit Form or View Mode */}
              {isEditing ? (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Edit User</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <Input
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Input
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* User Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {selectedUser.firstName && selectedUser.lastName
                          ? `${selectedUser.firstName} ${selectedUser.lastName}`
                          : "No name set"}
                      </h3>
                      <p className="text-gray-500">{selectedUser.email}</p>
                      <p className="text-sm text-gray-400">
                        Member since {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <ShoppingBag className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                      <div className="text-2xl font-semibold">{selectedUser._count.orders}</div>
                      <div className="text-sm text-gray-500">Orders</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <MapPin className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                      <div className="text-2xl font-semibold">{selectedUser.addresses.length}</div>
                      <div className="text-sm text-gray-500">Addresses</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Mail className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                      <div className="text-2xl font-semibold">1</div>
                      <div className="text-sm text-gray-500">Email</div>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Saved Addresses</h4>
                    {selectedUser.addresses.length === 0 ? (
                      <p className="text-gray-500 text-sm">No addresses saved</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedUser.addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className="bg-gray-50 rounded-lg p-4 border relative"
                          >
                            {addr.isDefault && (
                              <Badge className="absolute top-2 right-2" variant="default">
                                Default
                              </Badge>
                            )}
                            <p className="font-medium text-gray-900">
                              {addr.firstName} {addr.lastName}
                            </p>
                            <p className="text-gray-600 text-sm">{addr.addressLine}</p>
                            <p className="text-gray-600 text-sm">
                              {addr.city}, {addr.state} {addr.postalCode}
                            </p>
                            <p className="text-gray-600 text-sm">{addr.country}</p>
                            <p className="text-gray-500 text-sm mt-1">{addr.phone}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={handleEditUser}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteUser(selectedUser.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}