interface ModalDeletarContaProps {
    isOpen: boolean;
    onClose: () => void;
    tipoUsuario: 'paciente' | 'profissional';
    temConsultasAbertas: boolean;
}
export default function ModalDeletarConta({ isOpen, onClose, tipoUsuario, temConsultasAbertas }: ModalDeletarContaProps): import("react/jsx-runtime").JSX.Element | null;
export {};
