import {
  IconCategoryPlus,
  IconLayoutDashboard,
  IconMessages,
  IconPrinter,
  IconSettings,
  IconStack2,
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
    title: "Equipamentos",
    icon: IconPrinter,
    href: "/equipamentos",
  },
  {
    id: uuidv4(),
    title: "Respostas Rápidas",
    icon: IconMessages,
    href: "/quickAnswers",
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
    title: "Filas",
    icon: IconStack2,
    href: "/queues",
  },
  {
    id: uuidv4(),
    title: "Configurações",
    icon: IconSettings,
    href: "/settings",
  },
];

export default Menuitems;
