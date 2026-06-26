import { useState, useEffect } from 'react';
import { serviceAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiBriefcase, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const { user, selectedIndustry } = useAuth();
  
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    duration: 15,
    isActive: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const industry = selectedIndustry || user?.industry || '';
      const response = await serviceAPI.getAll(industry);
      setServices(response.data);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        serviceName: service.serviceName,
        description: service.description || '',
        duration: service.duration,
        isActive: service.isActive
      });
    } else {
      setEditingService(null);
      setFormData({
        serviceName: '',
        description: '',
        duration: 15,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const industry = selectedIndustry || user?.industry || 'General';
      const payload = { ...formData, industry };
      console.log('Creating service with payload:', JSON.stringify(payload));

      if (editingService) {
        await serviceAPI.update(editingService.id, payload);
        toast.success('Service updated successfully');
      } else {
        await serviceAPI.create(payload);
        toast.success('Service created successfully');
      }
      closeModal();
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service? This may affect existing appointments.')) {
      try {
        await serviceAPI.delete(id);
        toast.success('Service deleted successfully');
        fetchServices();
      } catch (error) {
        toast.error('Failed to delete service. It may be in use.');
      }
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in position-relative">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title d-flex align-items-center gap-2">
            <FiBriefcase className="text-primary" /> Service Management
          </h1>
          <p className="page-subtitle">Manage the services offered by your organization.</p>
        </div>
        <button className="btn-primary-custom" onClick={() => openModal()}>
          <FiPlus /> Add New Service
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service Name</th>
                <th>Description</th>
                <th>Est. Duration</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length > 0 ? (
                services.map((service) => (
                  <tr key={service.id}>
                    <td className="text-muted">#{service.id}</td>
                    <td className="fw-bold">{service.serviceName}</td>
                    <td className="text-muted" style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {service.description || 'No description'}
                    </td>
                    <td>{service.duration} mins</td>
                    <td>
                      <span className={`token-status ${service.isActive ? 'completed' : 'cancelled'}`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-end">
                      <button 
                        className="btn btn-sm text-primary mx-1" 
                        onClick={() => openModal(service)}
                        title="Edit Service"
                        style={{ background: 'rgba(59,130,246,0.1)', border: 'none', borderRadius: '4px', padding: '6px' }}
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        className="btn btn-sm text-danger mx-1" 
                        onClick={() => handleDelete(service.id)}
                        title="Delete Service"
                        style={{ background: 'rgba(244,63,94,0.1)', border: 'none', borderRadius: '4px', padding: '6px' }}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No services found. Add a service to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Modal for Add/Edit */}
      {isModalOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050, backdropFilter: 'blur(5px)' }}
        >
          <div className="glass-card p-0 overflow-hidden" style={{ width: '100%', maxWidth: '500px', animation: 'scaleIn 0.3s ease' }}>
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--border-color) !important' }}>
              <h4 className="m-0 fw-bold">{editingService ? 'Edit Service' : 'Add New Service'}</h4>
              <button className="btn btn-link text-muted p-0" onClick={closeModal}>
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-3">
                <label className="form-label-custom">Service Name</label>
                <input
                  type="text"
                  className="form-control form-control-custom w-100"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. General Checkup, Cash Deposit"
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label-custom">Description (Optional)</label>
                <textarea
                  className="form-control form-control-custom w-100"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Briefly describe what this service includes..."
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="form-label-custom">Estimated Duration (Minutes)</label>
                <input
                  type="number"
                  className="form-control form-control-custom w-100"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="480"
                />
              </div>

              <div className="mb-4 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isActiveCheck"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  style={{ cursor: 'pointer' }}
                />
                <label className="form-check-label ms-2" htmlFor="isActiveCheck" style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Service is Active (Available for booking)
                </label>
              </div>
              
              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-color) !important' }}>
                <button type="button" className="btn-secondary-custom" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-custom">
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
