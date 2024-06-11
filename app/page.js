"use client";

import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Home() {
  const router = useRouter();

  const [meetingCode, setMeetingCode] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    const toastId = toast.loading("Generating meeting code...");
    setTimeout(() => {
      const code = Math.random().toString(36).slice(2);
      setMeetingCode("lets-connect-" + code);
      setIsModalOpen(true);
      toast.dismiss(toastId);
    }, 1000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingCode);
    toast.success("Meeting code copied", {
      duration: 1000,
    });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleJoinClick = (e) => {
    e.preventDefault();

    router.push(`/room/${inputValue}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Meeting App</title>
      </Head>

      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          New Meeting
        </button>

        <form onSubmit={handleJoinClick} className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter a code or link"
            value={inputValue}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            disabled={!inputValue}
            className={`px-4 py-2 rounded-lg text-white ${
              inputValue ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            JOIN
          </button>
        </form>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm ">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">Your Meeting Code</h2>
            <input
              type="text"
              value={meetingCode}
              readOnly
              className="text-black mt-2 mb-4 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-green-600 text-white rounded-lg mr-2"
            >
              Copy Code
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
