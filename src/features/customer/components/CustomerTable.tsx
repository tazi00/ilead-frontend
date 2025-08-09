import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { customerService } from "../services/Customer.service";
import type { Customer } from "../services/Customer.service";

import { Button } from "@/components/ui/button";

function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await customerService.getPaginatedCustomers(page, limit);
      setCustomers(res.data.data.customers);
      const total = res.data.data.pagination.totalItems || 0;
      setTotalPages(Math.ceil(total / limit));
      setTotalCustomers(total);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold dark:text-white">
          Customers List
        </h2>
      </div>

      <div className="rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="dark:text-gray-200">Name</TableHead>
              <TableHead className="dark:text-gray-200">Email</TableHead>
              <TableHead className="dark:text-gray-200">Phone Number</TableHead>
              <TableHead className="dark:text-gray-200">
                Customer Status
              </TableHead>
              <TableHead className="dark:text-gray-200">
                Whatsapp Number
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-4 dark:text-gray-300"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell className="dark:text-gray-100">
                    {customer.name}
                  </TableCell>
                  <TableCell className="dark:text-gray-100">
                    {customer.email}
                  </TableCell>

                  <TableCell className="dark:text-gray-100">
                    {customer.phone_number}
                  </TableCell>
                  <TableCell className="dark:text-gray-100">
                    <Badge
                      variant={customer.meta?.active ? "default" : "secondary"}
                      className={
                        customer?.meta?.active
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-500 hover:bg-gray-600 text-white"
                      }
                    >
                      {customer.meta?.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="dark:text-gray-100">
                    {customer.meta?.whatsapp}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-4 dark:text-gray-400"
                >
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground dark:text-gray-300">
          Showing {customers.length} of {totalCustomers} total customers
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </Button>
          <span className="text-sm dark:text-white">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CustomerTable;
