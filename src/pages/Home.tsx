import React from "react";

import { Hero } from "../shared/components/Hero";
import { Categories } from "../shared/components/Categories";
import { Container } from "../shared/components/Container";
import { ProfileCompletionBanner } from "../features/profiles/components/ProfileCompletionBanner"; // You'll need to create this
import FeaturedProducts from "../shared/components/FeaturedProducts";
import Inspiration from "../shared/components/Inspiration";

export const Home: React.FC = () => {
  return (
    <>
      <ProfileCompletionBanner />
      <Hero />
      <Categories />
      <Container>
        <FeaturedProducts />
      </Container>
      <Inspiration />
    </>
  );
};
