import styles from "./UserTable.module.css"
interface Funcionario {
    id: number;
    nome: string;
    email: string;
    cargo: string;
    status: boolean;
    dataAdmissao: string;
}

interface UserTableProps {
    funcionarios: Funcionario[];
    onEditarStatus: (id: number, novoStatus: boolean) => void;
}

const UserTable: React.FC<UserTableProps> = ({ funcionarios, onEditarStatus }) => {
    if (funcionarios.length === 0) {
        return (
            <p className="empty-table">Nenhum funcionário encontrado.</p>
        );
    }

    return (
        <>
            <div className={styles.container}>
                <table className={styles.table_content}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Cargo</th>
                            <th>Status</th>
                            <th>Data de Admissão</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funcionarios.map((f) => (
                            <tr key={f.id}>
                                <td>{f.nome}</td>
                                <td>{f.email}</td>
                                <td>{f.cargo}</td>
                                <td><select
                                    value={f.status ? "Ativo" : "Inativo"}
                                    onChange={(e) => onEditarStatus(f.id, e.target.value === "Ativo") }>
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </select>
                                </td>
                                <td>{new Date(f.dataAdmissao).toLocaleDateString("pt-BR")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default UserTable;