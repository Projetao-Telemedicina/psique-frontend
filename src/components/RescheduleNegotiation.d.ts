interface RescheduleProposal {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    suggestedStartsAt: string;
    suggestedEndsAt: string;
    requestedBy: string;
    expiresAt: string;
}
interface RescheduleNegotiationProps {
    proposal: RescheduleProposal;
    isMyOwnProposal: boolean;
    loading: boolean;
    onConfirm: (confirmed: boolean) => void;
    onClose: () => void;
}
export default function RescheduleNegotiation({ proposal, isMyOwnProposal, loading, onConfirm, onClose }: RescheduleNegotiationProps): import("react/jsx-runtime").JSX.Element;
export {};
