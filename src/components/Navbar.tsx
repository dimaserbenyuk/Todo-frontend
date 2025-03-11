"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, BellIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/lib/authStore";

const navigation = [
  { name: "Dashboard", href: "/", current: false },
  { name: "Tasks", href: "/tasks", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { user, setUser, logout, checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth(); // ✅ Проверяем авторизацию при монтировании
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
      setIsDark(storedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };

  if (!mounted) return null; // Ждем загрузки на клиенте

  return (
    <Disclosure as="nav" className="bg-gray-900 text-white dark:bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-inset">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />}
                </DisclosureButton>
              </div>

              {/* Логотип и ссылки */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <Link href="/" className="text-xl font-bold hover:text-gray-300 transition">
                  📝 TodoApp
                </Link>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Кнопки справа */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Переключение темы */}
                <button onClick={toggleTheme} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition">
                  {isDark ? <SunIcon className="h-6 w-6 text-yellow-300" /> : <MoonIcon className="h-6 w-6 text-gray-300" />}
                </button>

                {/* Notifications (Заглушка) */}
                <button className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                </button>

                {/* Меню пользователя */}
                {user ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt="User profile"
                        />
                      </MenuButton>
                    </div>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                      <MenuItem>
                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Your Profile
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Выйти
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                ) : (
                  <div className="flex gap-4">
                    <Link href="/login" className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition">
                      Войти
                    </Link>
                    <Link href="/register" className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 transition">
                      Регистрация
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
