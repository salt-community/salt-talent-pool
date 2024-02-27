"use client";
import type { RouterOutputs } from "@/trpc/shared";
import EditUserRole from "./EditUserRoles";
import { useState } from "react";

type User = RouterOutputs["users"]["getAll"][number];
type Props = { users: User[] };

const Users = ({ users }: Props) => {
  const [filter, setFilter] = useState({ search: "", role: "" });

  return (
    <section className="w-full max-w-5xl self-center p-5">
      <form className="flex items-center justify-between text-sm md:text-base">
        <input
          className="min-w-0 border-b border-orange outline-none"
          type="text"
          id="search"
          value={filter.search}
          placeholder="Filter by email"
          onChange={({ target: { value } }) =>
            setFilter(({ role }) => ({ role, search: value }))
          }
        />
        <select
          className="border-b border-orange"
          value={filter.role}
          onChange={({ target: { value } }) =>
            setFilter(({ search }) => ({ role: value, search }))
          }
        >
          <option value="">Filter by role</option>
          <option value="SALTIE">Saltie</option>
          <option value="CLIENT">Client</option>
          <option value="ADMIN">Admin</option>
        </select>
      </form>
      <ul className="mt-10 flex flex-col gap-1">
        {users
          .filter(({ role }) =>
            filter.role ? role.toString() === filter.role : true,
          )
          .filter(({ email }) => {
            if (email && filter.search) {
              return email.includes(filter.search.toLowerCase());
            }
            return true;
          })
          .map((user) => (
            <EditUserRole key={user.id} user={user} />
          ))}
      </ul>
    </section>
  );
};

export default Users;
