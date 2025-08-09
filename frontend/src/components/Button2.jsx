import { Menu, X, Settings, ChevronUp, LogOutIcon } from 'lucide-react';



const Button = ({func, icon}) => {
  return (
      <button
          onClick={func}
          className="p-2 rounded-md cursor-pointer hover:bg-amber-600 transition-colors"
      >
          {icon === "up" && <ChevronUp size={24} className=""/>}
          {icon === "close" && <X size={24} className=""/>}
          {icon === "settings" && <Settings size={24} className="" />}
          {icon === "Menu" && <Menu size={24} className=""/>}
          {icon === "logout" && <LogOutIcon size={24}/>}
      </button>
  )
}

export default Button