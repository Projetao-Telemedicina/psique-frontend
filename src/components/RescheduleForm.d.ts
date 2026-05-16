interface RescheduleFormProps {
    appointment: {
        professionalId: string;
    };
    onSubmit: (date: string, time: string) => void;
    loading: boolean;
    role?: string;
}
export default function RescheduleForm({ appointment, onSubmit, loading, role }: RescheduleFormProps): import("react/jsx-runtime").JSX.Element;
export {};
