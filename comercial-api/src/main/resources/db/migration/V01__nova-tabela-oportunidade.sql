create table oportunidade (
   opo_id bigint auto_increment not null,
   opo_nome_prospecto varchar(80) not null,
   opo_descricao varchar(200) not null,
   opo_valor decimal(10,2),
   
   primary key (opo_id)
);  