import React from 'react';
interface SidebarProps {
    role: UserRole;
    itemAtivo: string;
    atendimentoAtivo?: boolean;
}
type UserRole = 'paciente' | 'profissional' | 'administrador';
declare const Sidebar: React.FC<SidebarProps>;
export default Sidebar;
