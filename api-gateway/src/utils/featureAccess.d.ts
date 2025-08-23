import { Feature } from "../../../shared/config/featureFlagTypes";
export declare const canUserAccessFeature: (feature: Feature, ctx: {
    role: string;
    isPro: boolean;
    userId: string;
}) => boolean;
