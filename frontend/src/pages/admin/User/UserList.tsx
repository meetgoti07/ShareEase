import Layout from "@/layout/Layout.tsx";
import { getUsers } from "@/pages/admin/api/api.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";

import { UserProfileSchema } from "@/Schema/Schema.ts";

export default function UserList() {
  const [users, setUsers] = useState<UserProfileSchema[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  const handleEdit = (id: number) => {
    navigate(`edit/${id}`);
  };


  return (
    <Layout>
      <div className="flex justify-between items-center mb-4 mt-4">
        <h1 className="text-2xl font-bold">User List</h1>
        <Button onClick={() => navigate('/admin/add-user')}>Add User</Button>
      </div>
      <Card className={'border-none shadow-none'}>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Institute</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: UserProfileSchema) => (
                <TableRow key={user.user.id}>
                  <TableCell>{user.user.id}</TableCell>
                  <TableCell>{user.user.username}</TableCell>
                  <TableCell>{user.user.email}</TableCell>
                  <TableCell>{user.institute}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.division}</TableCell>
                  <TableCell>{user.mobile_number}</TableCell>
                  <TableCell>{user.company_name}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(user.user.id)}
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
}
