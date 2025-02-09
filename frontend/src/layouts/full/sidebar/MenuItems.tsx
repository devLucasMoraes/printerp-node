import {
  IconAddressBook,
  IconBrandWhatsapp,
  IconLayoutDashboard,
  IconMessages,
  IconPlugConnected,
  IconSettings,
  IconStack2,
  IconUsers,
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
    title: "Conexões",
    icon: IconPlugConnected,
    href: "/connections",
  },
  {
    id: uuidv4(),
    title: "Tickets",
    icon: IconBrandWhatsapp,
    href: "/tickets",
  },
  {
    id: uuidv4(),
    title: "Contatos",
    icon: IconAddressBook,
    href: "/contacts",
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
