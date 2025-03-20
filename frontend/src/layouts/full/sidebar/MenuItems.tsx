import {
  IconAffiliate,
  IconBox,
  IconBuildingWarehouse,
  IconCategoryPlus,
  IconChecklist,
  IconHeartHandshake,
  IconLayoutDashboard,
  IconPackages,
  IconReplaceUser,
  IconSettings,
  IconUsers,
  IconUserUp,
} from "@tabler/icons-react";
import { v4 as uuidv4 } from "uuid";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uuidv4(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
  },
  {
    id: uuidv4(),
    title: "Emprestimos",
    icon: IconReplaceUser,
    href: "/emprestimos",
  },
  {
    id: uuidv4(),
    title: "Parceiros",
    icon: IconHeartHandshake,
    href: "/parceiros",
  },
  {
    id: uuidv4(),
    title: "Armazéns",
    icon: IconBuildingWarehouse,
    href: "/armazens",
  },
  {
    id: uuidv4(),
    title: "Estoques",
    icon: IconPackages,
    href: "/estoques",
  },
  {
    id: uuidv4(),
    title: "Categorias",
    icon: IconCategoryPlus,
    href: "/categorias",
  },
  {
    id: uuidv4(),
    title: "Requisitantes",
    icon: IconUserUp,
    href: "/requisitantes",
  },
  {
    id: uuidv4(),
    title: "Setores",
    icon: IconAffiliate,
    href: "/setores",
  },
  {
    id: uuidv4(),
    title: "Insumos",
    icon: IconBox,
    href: "/insumos",
  },
  {
    id: uuidv4(),
    title: "Requisições",
    icon: IconChecklist,
    href: "/requisicoes-estoque",
  },
  {
    navlabel: true,
    subheader: "Administração",
  },
  {
    id: uuidv4(),
    title: "Usuários",
    icon: IconUsers,
    href: "/users",
  },
  {
    id: uuidv4(),
    title: "Configurações",
    icon: IconSettings,
    href: "/settings",
  },
];

export default Menuitems;
