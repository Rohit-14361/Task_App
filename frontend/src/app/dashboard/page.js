"use client";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { apiConnector } from '../../services/apiConnector';
import { taskEndpoints } from '../../services/apis';
import { setTasks, addTask, updateTaskItem, removeTask, setLoading } from '../../redux/slices/taskSlice';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { isAuthenticated, user, token } = useSelector(state => state.user);
  const { tasks, pagination, loading } = useSelector(state => state.task);
  const dispatch = useDispatch();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending' });
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // If we've initialized and the user is NOT authenticated, redirect
    if (!token && typeof window !== 'undefined') {
      router.push('/login');
    }
  }, [isAuthenticated, token, router]);

  const fetchTasks = async (page = 1) => {
    if (!token) return;
    dispatch(setLoading(true));
    try {
      const res = await apiConnector(
        'GET', 
        taskEndpoints.GET_ALL_TASKS_API, 
        null, 
        { Authorization: `Bearer ${token}` }, // pass headers
        {
          page,
          limit: 10,
          status: filter || undefined,
          search: search || undefined
        }
      );
      if (res.data.success) {
        dispatch(setTasks({ tasks: res.data.tasks, pagination: res.data.pagination }));
        setCurrentPage(res.data.pagination.page);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTasks(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search, filter, token]); // fetch when search or filter changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }
    
    try {
      if (editingTask) {
        const res = await apiConnector(
          'PUT', 
          `${taskEndpoints.UPDATE_TASK_API}/${editingTask._id}`, 
          formData,
          { Authorization: `Bearer ${token}` }
        );
        if (res.data.success) {
          dispatch(updateTaskItem(res.data.task));
          toast.success('Task updated');
        }
      } else {
        const res = await apiConnector(
          'POST', 
          taskEndpoints.CREATE_TASK_API, 
          formData,
          { Authorization: `Bearer ${token}` }
        );
        // Note: The backend create task adds task IDs to user but does not return the full task populated. 
        // We'll refetch to ensure consistent state and pagination
        toast.success('Task created');
        fetchTasks(1);
      }
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const res = await apiConnector(
          'DELETE', 
          `${taskEndpoints.DELETE_TASK_API}/${taskId}`,
           null,
           { Authorization: `Bearer ${token}` }
        );
        if (res.data.success) {
          dispatch(removeTask(taskId));
          toast.success('Task deleted');
          fetchTasks(currentPage); // Optional: refetch instead to maintain pagination accurately
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({ title: task.title, description: task.description, status: task.status });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'pending' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', status: 'pending' });
  };

  if (!token) return <div className="min-h-screen bg-gray-900 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button 
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded text-white transition"
          >
            + Create Task
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading tasks...</div>
        ) : tasks.length === 0 ? (
           <div className="text-center py-10 text-gray-400">No tasks found. Create one!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
              <div key={task._id} className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold break-words flex-1 pr-2">{task.title}</h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                    task.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                    task.status === 'in-progress' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-gray-600/50 text-gray-300'
                  }`}>
                    {task.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-400 mb-6 flex-1 break-words">{task.description}</p>
                
                <div className="flex gap-2 mt-auto">
                  <button 
                    onClick={() => openModal(task)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded transition"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(task._id)}
                    className="flex-1 bg-red-900/40 hover:bg-red-900/60 text-red-500 py-2 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button 
              disabled={currentPage <= 1}
              onClick={() => fetchTasks(currentPage - 1)}
              className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700"
            >
              Prev
            </button>
            <span className="px-4 py-2 text-gray-400">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <button 
              disabled={currentPage >= pagination.totalPages}
              onClick={() => fetchTasks(currentPage + 1)}
              className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">{editingTask ? 'Edit Task' : 'Create Task'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-1">Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Description</label>
                  <textarea 
                    required
                    rows="3"
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Status</label>
                  <select 
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex gap-4 mt-6">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded transition font-bold"
                  >
                    {editingTask ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
