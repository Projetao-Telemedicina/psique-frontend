interface CampoPerfilProps {
    label: string;
    valor: string;
    isEditing: boolean;
    onChange?: (val: string) => void;
    type?: 'text' | 'password' | 'date' | 'select' | 'textarea';
    options?: {
        label: string;
        value: string;
    }[];
}
export declare const CampoPerfil: ({ label, valor, isEditing, onChange, type, options }: CampoPerfilProps) => import("react/jsx-runtime").JSX.Element;
export {};
