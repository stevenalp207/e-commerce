import React, { useState, useEffect } from "react";
import { useCollapse } from "react-collapsed";
import { useStore } from "@nanostores/react";
import { layoutView, setLayoutView } from "@/cartStore";
import { BsGridFill } from "react-icons/bs";
import { FaList } from "react-icons/fa6";
import { TbFilter, TbFilterX, TbFilterCancel } from "react-icons/tb";
import DropdownMenu from "../filter/DropdownMenu";
import { type SortFilterItem, sorting } from "@/lib/constants";
import ProductFilters from "../ProductFilters";

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { title: string; path: string };

const ProductLayouts = ({
  categories,
  vendors,
  tags,
  maxPriceData,
  vendorsWithCounts,
  categoriesWithCounts,
}: any) => {
  const { getCollapseProps, getToggleProps, isExpanded, setExpanded } =
    useCollapse();
  const [isInputEditing, setInputEditing] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false); // Estado para saber si hay filtros activos
  const layout = useStore(layoutView);

  const layoutChange = (isCard: string) => {
    setLayoutView(isCard === "list" ? "list" : "card");
  };

  const resetFilters = () => {
    // 1. Elimina los parámetros de la URL
    const url = new URL(window.location.href);
    url.search = ""; // Elimina todos los parámetros
    window.history.pushState({}, "", url.toString());

    // 2. Reinicia el estado interno de los filtros (opcional, si tienes estados locales o globales)
    setExpanded(false); // Cierra el filtro colapsable (si aplica)

    // 3. Recarga la página para reflejar los cambios
    window.location.reload(); // Recarga la página con la URL limpia
    setHasActiveFilters(false); // Actualiza el estado de filtros activos
  };

  // Suponiendo que la lógica de los filtros modifica la URL, actualizamos el estado de hasActiveFilters
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.toString()) {
      setHasActiveFilters(true);
    } else {
      setHasActiveFilters(false);
    }
  }, [window.location.search]);

  useEffect(() => {
    const inputField = document.getElementById(
      "searchInput",
    ) as HTMLInputElement;
    if (
      isInputEditing ||
      new URLSearchParams(window.location.search).get("q")
    ) {
      inputField?.focus();
    }
  }, [isInputEditing]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".collapse-container-class") &&
        !target.closest(".filter-button-container") &&
        isExpanded
      ) {
        setExpanded(false);
      }

      if (!target.closest("#searchInput") && isInputEditing) {
        setInputEditing(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isExpanded, isInputEditing]);

  return (
    <section className="pt-4">
      <div className="container">
        <div className="row">
          <div className="col-3 max-lg:hidden" />

          <div className="col-12 lg:col-9">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-x-4 items-center font-medium text-xs md:text-base">
                <p className="max-md:hidden text-dark dark:text-darkmode-dark">
                  Vistas
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => layoutChange("card")}
                    className={`btn border dark:border-darkmode-border ${
                      layout === "list" ? "btn-outline-primary" : "btn-primary"
                    } p-2 hover:scale-105 duration-300`}
                  >
                    <BsGridFill />
                  </button>
                  <button
                    onClick={() => layoutChange("list")}
                    className={`btn border dark:border-darkmode-border ${
                      layout === "list" ? "btn-primary" : "btn-outline-primary"
                    } p-2 hover:scale-105 duration-300`}
                  >
                    <FaList />
                  </button>
                </div>
              </div>

              <div className="flex gap-x-8">
                <div className="filter-button-container block lg:hidden mt-1">
                  <button {...getToggleProps()}>
                    {isExpanded ? (
                      <span className="font-medium text-base flex gap-x-1 items-center justify-center">
                        <TbFilterX /> Filtros
                      </span>
                    ) : (
                      <span className="font-medium text-base flex gap-x-1 items-center justify-center">
                        <TbFilter /> Filtros
                      </span>
                    )}
                  </button>
                </div>

                <div className="filter-button-container block mt-1">
                  <button
                    {...getToggleProps()}
                    onClick={resetFilters}
                    disabled={!hasActiveFilters} // Deshabilitar el botón si no hay filtros activos
                    className={`${
                      !hasActiveFilters ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <span className="font-medium text-base flex gap-x-1 items-center justify-center">
                      <TbFilterCancel /> Eliminar filtros
                    </span>
                  </button>
                </div>

                <div className="flex gap-x-4 items-center font-medium text-sm md:text-base relative ">
                  <p className="max-md:hidden text-dark dark:text-darkmode-dark">
                    Filtrar por
                  </p>
                  <DropdownMenu list={sorting} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 lg:col-3">
            <div className="lg:block relative">
              <div className="block lg:hidden w-full">
                <section
                  className="collapse-container-class z-20 bg-body dark:bg-darkmode-body w-full px-4 rounded-md"
                  {...getCollapseProps()}
                >
                  <div className="pb-8">
                    <ProductFilters
                      categories={categories}
                      vendors={vendors}
                      tags={tags}
                      maxPriceData={maxPriceData}
                      vendorsWithCounts={vendorsWithCounts}
                      categoriesWithCounts={categoriesWithCounts}
                    />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductLayouts;
