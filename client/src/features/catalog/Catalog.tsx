import { Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import useProducts from "../../app/hooks/useProducts";

import LoadingComponent from "../../app/layout/LoadingComponent";
import {
    useAppDispatch,
    useAppSelector,
} from "../../app/store/configureStore";
import { setPageNumber, setProductParams } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";

const sortOptions = [
    { value: "name", label: "Alphabetical" },
    { value: "priceDesc", label: "Price - High to low" },
    { value: "price", label: "Price - Low to high" },
];

export default function Catalog() {
    const {
        products,
        brands,
        types,
        filtersLoaded,
        productsLoaded,
        metaData,
    } = useProducts();
    const { productParams } = useAppSelector(
        (state) => state.catalog
    );
    const dispatch = useAppDispatch();

    const [filtersDisabled, setFiltersDisabled] = useState(false);

    useEffect(() => {
        setFiltersDisabled(!productsLoaded);
    }, [productsLoaded]);

    if (!filtersLoaded)
        return <LoadingComponent message="Loading Products" />;

    return (
        <Grid container columnSpacing={4}>
            <Grid item xs={3}>
                <Paper sx={{ mb: 2 }}>
                    <ProductSearch />
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    <RadioButtonGroup
                        selectedValue={productParams.orderBy}
                        options={sortOptions}
                        onChange={(e) => {
                            setFiltersDisabled(true);
                            dispatch(
                                setProductParams({
                                    orderBy: e.target.value,
                                })
                            );
                        }}
                    />
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    <CheckboxButtons
                        items={brands}
                        checked={productParams.brands}
                        isDisabled={filtersDisabled}
                        onChange={(items: string[]) => {
                            setFiltersDisabled(true);
                            dispatch(
                                setProductParams({
                                    brands: items,
                                })
                            );
                        }}
                    />
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    <CheckboxButtons
                        items={types}
                        checked={productParams.types}
                        isDisabled={filtersDisabled}
                        onChange={(items: string[]) =>
                            dispatch(
                                setProductParams({
                                    types: items,
                                })
                            )
                        }
                    />
                </Paper>
            </Grid>
            <Grid item xs={9}>
                <ProductList products={products} />
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={9} sx={{ mb: 2 }}>
                {metaData && (
                    <AppPagination
                        key={metaData.currentPage}
                        metaData={metaData}
                        onPageChange={(page: number) =>
                            dispatch(
                                setPageNumber({ pageNumber: page })
                            )
                        }
                    />
                )}
            </Grid>
        </Grid>
    );
}
