const autorizarCargo = (cargosPermitidos: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!req.usuario || !cargosPermitidos.includes(req.usuario.cargo)) {
        return res.status(403).json({ erro: 'Acesso negado! Você não tem permissão.' });
      }
      next();
    };
  };
  
  export default autorizarCargo;
  