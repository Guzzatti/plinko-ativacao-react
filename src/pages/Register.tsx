import { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useNavigate } from 'react-router-dom';

interface FormData {
  fullName: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
}

interface FormErrors {
  [key: string]: string;
}

export function Register() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    cpf: '',
    birthDate: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate(); // Usando o hook useNavigate

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }
    
    if (!formData.cpf.trim() || !/^\d{11}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }
    
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.phone.trim() || !/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Simulando checagem de CPF existente
    const hasExistingCPF = Math.random() > 0.5;

    if (hasExistingCPF) {
      setModalMessage('CPF já cadastrado. O cadastro é único por CPF.');
    } else {
      setModalMessage('Boa sorte!');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/'); // Redireciona para a home ao fechar o modal
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">Cadastro</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome Completo"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
          />
          
          <Input
            label="CPF"
            type="text"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value.replace(/\D/g, '') })}
            maxLength={11}
            error={errors.cpf}
          />
          
          <Input
            label="Data de Nascimento"
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            error={errors.birthDate}
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />
          
          <Input
            label="Telefone Celular"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
            maxLength={11}
            error={errors.phone}
          />
          
          <Button type="submit" fullWidth>
            Cadastrar
          </Button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">{modalMessage}</h3>
            <Button onClick={handleCloseModal} fullWidth>
              Fechar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
