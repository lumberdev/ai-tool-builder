"use client";

import {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export type ModalImperativeFunctions = {
  closeModal: () => void;
  openModal: () => void;
};

type ModalProps = {
  children: ReactNode;
  isDefaultOpen?: boolean;
};

const Modal = forwardRef(
  ({ isDefaultOpen = false, children }: ModalProps, ref) => {
    const [showModal, setShowModal] = useState(isDefaultOpen);
    const [documentMounted, setDocumentMounted] = useState(false);

    // This hook takes an outside reference and injects
    // functions that are callable from the parent.
    // Useful for this particular situation where we
    // might want to close a modal based on an action from the parent.
    useImperativeHandle(
      ref,
      () => {
        return {
          closeModal() {
            setShowModal(false);
          },
          openModal() {
            setShowModal(true);
          },
        };
      },
      []
    );

    useEffect(() => {
      // Nextjs 13 was giving hydration issues
      setDocumentMounted(true);
    }, []);

    const modalRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: React.MouseEvent<HTMLElement>) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as HTMLElement)
      )
        setShowModal(false);
    };

    const ModalContent = (
      <div
        ref={modalRef}
        className={
          "relative mx-auto h-full w-1/2 rounded-md bg-white p-4 shadow-lg"
        }
      >
        <div className="flex w-full justify-end">
          <button
            className="text-primary-500 w-fit"
            onClick={() => setShowModal(false)}
          >
            X
          </button>
        </div>
        {children}
      </div>
    );

    return documentMounted
      ? createPortal(
          showModal && (
            <div
              id="24543"
              className={
                "bg-tertiary-300/30 absolute left-0 top-0 isolate z-50 flex min-h-full min-w-full items-end justify-center"
              }
              onClick={handleClickOutside}
            >
              {ModalContent}
            </div>
          ),
          document?.body
        )
      : null;
  }
);

Modal.displayName = "Modal";

export default Modal;
