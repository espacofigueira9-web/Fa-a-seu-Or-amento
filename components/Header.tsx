import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-[#026842]">
        Orçamento de Casamento
      </h1>
      <h2 className="text-2xl sm:text-3xl text-[#026842] mt-2">
        Figueira Eventos
      </h2>
      <p className="mt-4 text-lg text-gray-600">
        Realize o seu casamento dos sonhos com exclusividade.
      </p>
    </header>
  );
};

export default Header;