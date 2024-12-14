import { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, query, setDoc, where } from "firebase/firestore"; 
import { collection } from "firebase/firestore";
import { getDocs } from "firebase/firestore";


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
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate(); // Usando o hook useNavigate

  async function verifyCPF(formData: FormData) {
      // Simulando checagem de CPF existente
      const clientsRef = collection(db, 'clients');
      const cpfQuery = query(clientsRef,where('cpf', '==', formData.cpf))
      const cpfSnapshot = await getDocs(cpfQuery);
      const hasExistingCPF = !cpfSnapshot.empty;

      return hasExistingCPF;
  }

  const validateForm = async () => {
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

    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim() || !/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }

    if(!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if(await verifyCPF(formData)) {
      newErrors.cpf = 'CPF já cadastrado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();

    if (!isValid) {
      return;
    }
    
    await saveData();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/'); // Redireciona para a home ao fechar o modal
  };

  async function saveData() {
    try {
      await setDoc(doc(db, "clients", formData.cpf), formData);
      setModalMessage('Cadastro realizado com sucesso!');
      setShowModal(true);
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      setModalMessage('Erro ao salvar os dados. Tente novamente.');
      setShowModal(true);
    }
  }

  function formatCPF(cpf: string) {
    return cpf
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os 3 primeiros dígitos
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os 3 segundos dígitos
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona hífen após os 3 últimos dígitos
  }

  function formatPhone(phone: string) {
    return phone
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/(\d{2})(\d)/, '($1) $2') // Adiciona parênteses após os 2 primeiros dígitos
      .replace(/(\d{5})(\d)/, '$1-$2'); // Adiciona hífen após os 5 primeiros dígitos
  }

  function validateCPF(cpf: string) {
    const cpfNumbers = cpf.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) return false;

    const cpfArray = Array.from(cpfNumbers).map(Number);

    if (cpfArray.every((digit) => digit === cpfArray[0])) {
      return false;
    }

    const calculateDigit = (cpfArray: number[], factor: number) => {
      const total = cpfArray.reduce((sum, num) => sum + num * factor--, 0);
      const remainder = total % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstDigitCorrect = calculateDigit(cpfArray.slice(0, 9), 10);
    const secondDigitCorrect = calculateDigit(cpfArray.slice(0, 10), 11);

    return cpfArray[9] === firstDigitCorrect && cpfArray[10] === secondDigitCorrect;
  }



  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Cadastro
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome Completo"
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            error={errors.fullName}
          />

          <Input
            label="CPF"
            type="text"
            value={formatCPF(formData.cpf)}
            onChange={(e) =>
              setFormData({
                ...formData,
                cpf: e.target.value.replace(/\D/g, ''),
              })
            }
            maxLength={14}
            error={errors.cpf}
          />

          <Input
            label="Data de Nascimento"
            type="date"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
            error={errors.birthDate}
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
          />

          <Input
            label="Telefone Celular"
            type="tel"
            value={formatPhone(formData.phone)}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value.replace(/\D/g, ''),
              })
            }
            maxLength={15}
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
