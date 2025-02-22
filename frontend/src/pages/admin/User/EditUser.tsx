import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/layout/Layout.tsx";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {User, UserProfile} from "@/Schema/Schema";
import { getUserById, editUser } from "@/pages/admin/api/api";

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Initialize react-hook-form with our UserProfile type
  const form = useForm<UserProfile>({
    defaultValues: {
        id : 0,
        institute: "",
        department: "",
        division: "",
        mobile_number: "",
        company_name: "",
        address: "",
    },
  });

  useEffect(() => {
    if (id) {
      getUserById(id).then((data) => {
        setProfile(data);
        // Pre-fill form with fetched data
        form.reset(data);
      });
    }
  }, [id, form]);

  const onSubmit = async (data: UserProfile) => {
    if (id) {
      await editUser(id, data);
      navigate("/admin/users");
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <Layout>
      <Card>
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Edit User</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username (read-only) */}
              <FormField
                control={form.control}
                name="user.username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email (read-only) */}
              <FormField
                control={form.control}
                name="user.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Institute */}
              <FormField
                control={form.control}
                name="institute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institute</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="Institute" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Department */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Department" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Division */}
              <FormField
                control={form.control}
                name="division"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Division" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Mobile Number */}
              <FormField
                control={form.control}
                name="mobile_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Mobile Number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Company Name */}
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Company Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default EditUser;
