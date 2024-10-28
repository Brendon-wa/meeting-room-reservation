"use client";

import { MenuTicket } from "@/app/_components/menu";
import { ModalProfile } from "@/app/_components/profile";
import { createContext, ReactNode, useState } from "react";

interface ModalContextData {
  isVisible: boolean;
  isVisibleProfile: boolean;
  handleModalVisible: (option: string) => void;
}

export const ModalContext = createContext({} as ModalContextData);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleProfile, setIsVisibleProfile] = useState(false);
  const [optionModal, setOptionModal] = useState('menu');

  function handleModalVisible(option: string) {
    if (option === 'menu') setIsVisible(!isVisible);
    if (option === 'profile') {
      setIsVisibleProfile(!isVisibleProfile)
      setIsVisible(false)
    };
    setOptionModal(option);
  }

  return (
    <ModalContext.Provider
      value={{ isVisible, isVisibleProfile, handleModalVisible }}
    >
      {isVisible && optionModal === 'menu' && <MenuTicket />}
      {isVisibleProfile && optionModal === 'profile' && <ModalProfile />}
      {children}
    </ModalContext.Provider>
  );
};
