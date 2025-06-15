import React from 'react';
import GuidelinePage from '../../components/ui/GuideLine/guidelineTabs';
import Header from '../../components/layouts/Headers/Header';
import SearchBar from '../../components/layouts/Headers/SubHeader';
import MenuBar from '../../components/ui/MenuBar/MenuBar';
import Footer from '../../components/layouts/Footers/Footer';

function GuildTabs() {
    return (
        <>
        <Header />
        <SearchBar />
        <MenuBar />
        <GuidelinePage />
        <Footer />
        </>
    );
}

export default GuildTabs;