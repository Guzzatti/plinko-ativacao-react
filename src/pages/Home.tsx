import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { exportFirestoreToExcel } from '../export';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-start p-2"> {/* Alterei para p-2 */}
      <div className="max-w-2xl w-full text-center space-y-16">
        <img 
          src="src/fotos/logo2.png" 
          alt="Aloha Guzzatti Logo" 
          className="mx-auto w-1/2 max-w-[300px] md:max-w-[500px] h-auto"
        />
        <p className="text-xl text-gray-600">
          Aloha! Faça seu cadastro rápido para ganhar uma chance no Plinko Board da Guzzatti!
        </p>
        <Button 
          onClick={() => navigate('/cadastro')}
          className="inline-flex items-center gap-2"
        >
          Clique aqui! <ArrowRight className="w-5 h-10" />
        </Button>

        <Button 
          onClick={() => {

            exportFirestoreToExcel();
          }}
          className="inline-flex items-center gap-2"
        >
          Exportar para Excel
        </Button>
      </div>
    </div>
  );
}

