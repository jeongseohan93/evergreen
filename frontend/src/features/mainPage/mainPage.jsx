import React from "react";
import Header from "../../components/layouts/Headers/Header";
import SearchBar from "../../components/layouts/Headers/SubHeader";
import Footer from "../../components/layouts/Footers/Footer";
import Banner from "../../components/ui/Banner/Banner";
import MenuBar from "../../components/ui/MenuBar/MenuBar";
function MainPage() {
    return (
        <>
            <Header />
            <SearchBar />
            <MenuBar />
            <Banner />
            <div className="h-96 bg-white"></div>
            <Footer />
        </>
    );
}

export default MainPage;
