import React, { useEffect } from "react";
import "./DashboardPage.css";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../Utils/apiRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFirebaseAuth } from '../../Utils/FirebaseAuthContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (text) => {
      const response = await apiRequest.post("/api/chats", { text });
      return response.data;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const { user, loading } = useFirebaseAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/sign-in");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    mutation.mutate(text);
  };

  return (
    <div className="dashboardPage">
      <div className="text">
        <div className="text-logo">
          <img src="/logo.png" alt="logo" />
          <h1>LUMINO AI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="chat" />
            <span>Create a new Chat</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="chat" />
            <span>Analyze Images</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="chat" />
            <span>Help me with my code</span>
          </div>
        </div>
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          name="text"
          placeholder="Ask me anything"
          autoComplete="off"
        />
        <button type="submit">
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </div>
  );
};

export default DashboardPage;
