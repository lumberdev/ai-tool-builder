"use client";

import { useEffect, useRef } from "react";
import Modal, { ModalImperativeFunctions } from "../Modal";
import { useEditorController } from "./editorControllerHook/EditorContext";

export const EditorComponent = () => {
  const { ref, id, handleInsertDataBasedOnSelection } = useEditorController();

  const modalRef = useRef<ModalImperativeFunctions>();

  useEffect(() => {
    if (!modalRef.current) return;
    const openModalAction = modalRef.current?.openModal;
    window.addEventListener("_onopenmenu", openModalAction);

    return () => {
      window.removeEventListener("_onopenmenu", openModalAction);
    };
  }, []);

  return (
    <>
      <Modal ref={modalRef}>
        modal
        <div className="flex flex-col">
          <button
            onClick={async () =>
              await handleInsertDataBasedOnSelection("paragraph")
            }
          >
            Paragraph
          </button>
          <button
            onClick={async () =>
              await handleInsertDataBasedOnSelection("simpleDropdown")
            }
          >
            Dropdown
          </button>
          <button
            onClick={async () =>
              await handleInsertDataBasedOnSelection("simpleInput")
            }
          >
            Input
          </button>
        </div>
      </Modal>
      <div className="relative h-full min-w-full md:p-4">
        <div ref={ref} id={id} className="w-full rounded-md bg-white p-2" />
      </div>
    </>
  );
};
