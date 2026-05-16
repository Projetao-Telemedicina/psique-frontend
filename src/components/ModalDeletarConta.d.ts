interface ModalDeletarContaProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (senha: string) => Promise<void>;
    tipoUsuario: 'paciente' | 'profissional';
    temConsultasAbertas: boolean;
}
export default function ModalDeletarConta({ isOpen, onClose, onConfirm, tipoUsuario, temConsultasAbertas }: ModalDeletarContaProps): import("react/jsx-runtime").JSX.Element | null;
export {};
