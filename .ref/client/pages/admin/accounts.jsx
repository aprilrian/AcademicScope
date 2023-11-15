import Head from "next/head";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import useSWR, { useSWRConfig } from "swr";
import Pagination from "../../components/pagination";
import { paginate } from "../../utils/functions/paginate";
import Search from "../../components/Search";
import { Modal, Box, Typography } from "@mui/material";
import ConfirmModal from "../../components/ConfirmModal";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const token = getCookie("accessToken");
// Fetcher and set header x-access-token with token
const fetcher = (...args) =>
  fetch(...args, {
    headers: {
      "x-access-token": token,
    },
  }).then((res) => res.json());

export default function AccountAdmin() {
  // Data Fetching
  const { data: user, error } = useSWR(
    `${process.env.BACKEND_API}/list-user`,
    fetcher
  );

  const { mutate } = useSWRConfig();

  // Pagination
  const [posts, setposts] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const pageSize = 8;

  const [success, setSuccess] = useState(null);

  //  Search
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("username");
  const [clickId, setClickId] = useState("");

  // modal handle
  const [open, setOpen] = useState({ val: false, id: null });
  const handleOpen = () => setOpen({ val: true, id: null });
  const handleClose = () => setOpen({ val: false, id: null });

  const [reset, setReset] = useState(false);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleKategori = (e) => {
    setKategori(e.target.value);
  };

  useEffect(() => {
    console.log("tests");
    if (reset) {
      const formData = new FormData();
      formData.append("id", open["id"]);

      try {
        fetch(`${process.env.BACKEND_API}/resetpassword`, {
          method: "POST",
          headers: {
            "x-access-token": token,
          },
          body: formData,
        });
        console.log(open["id"]);
        setReset(false);
        setOpen({ val: false, id: null });
        toast.info('Password Berhasil di Reset !', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      } catch (err) {
        console.log(err);
        setSuccess(false);
      }
    }
  }, [open, reset]);


  // useEffect for setposts
  useEffect(() => {
    if (user) {
      // Sort data by user.roles.name
      const sortedUser = user.sort((a, b) => {
        if (a.roles.name < b.roles.name) {
          return -1;
        }
        if (a.roles.name > b.roles.name) {
          return 1;
        }
        return 0;
      });

      if (search) {
        setcurrentPage(1);
        if (kategori === "username") {
          setposts(
            sortedUser.filter((user) =>
              user.username.toLowerCase().includes(search.toLowerCase())
            )
          );
        }
      } else {
        setposts(sortedUser);
      }
    }
  }, [kategori, search, user]);

  const handlePageChange = (page) => {
    setcurrentPage(page);
  };

  const userPosts = paginate(posts, currentPage, pageSize);

  return (
    <>
      <Head>
        <title>List Akun</title>
      </Head>
      <h2 className="text-left font-bold text-2xl pl-5 pt-4">Data Akun</h2>
      <div className="mx-5 mt-4">
        <Search
          setSearch={handleSearch}
          setKategori={handleKategori}
          kategori={kategori}
          listKategori={["Username"]}
        />
      </div>
      <div className="flex flex-col items-center">
        <div className="py-2 my-2 overflow-x-auto w-full px-6">
          <div className="inline-block w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                    Username
                  </th>
                  <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                    Role
                  </th>
                  <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                    Aksi
                  </th>
                </tr>
              </thead>
              {/* show data in table body */}
              <tbody className="bg-white">
                {userPosts &&
                  userPosts.map((u) => (
                    <tr key={u._id}>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm leading-5 font-medium text-gray-900">
                              {u.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div className="text-sm leading-5 text-gray-900">
                          {u.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div className="text-sm leading-5 text-gray-900">
                          {u.roles.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                        <button
                          // href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => {
                            setOpen({ val: true, id: u._id });
                            // setClickId(u._id);
                            // handleSubmit(u._id);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <ConfirmModal
            open={open["val"]}
            handleClose={handleClose}
            setReset={setReset}
          />
          <br />
          <br />
          <Pagination
            items={posts.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </div>
    </>
  );
}
