import { Resolver, ResolveField, Parent, Mutation, Query, Args, Context, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { OrderService } from "./orders.service";

//Entities
import { SuccessInfo } from "src/user/entities/success.entity";
import { Order, OrderProductInfo, SubProductInfo } from "./entities/order.entity";
import { OrderBySeller } from "./entities/order-by-seller.entity";
import { Seller } from "src/seller/entities/seller.entity";
import { User } from "src/user/entities/user.entity";
import { Address } from "src/address/entities/address.entity";
import { Product } from "src/product/entities/product.entity";

//Dto
import { OrderInput } from "./dto/orders.dto";
import { SellerStatusInput } from "./dto/seller-status.dto";
import { CancelStatusInput } from "./dto/cancel-status.dto";
import { AdminStatusInput } from "./dto/admin-status.dto";
import { TrackInput } from "./dto/track.dto";

//Guard
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

//Types
import { ReqUser } from "src/auth/types/user.types";

@Resolver(Order)
export class OrderResolver {
    //Constructor
    constructor(
        private readonly orderService: OrderService
    ) { }

    //Get Orders For Admin Dashboard
    @Query(() => [Order], { name: "getOrders" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getOrders() {
        return this.orderService.getOrders();
    };

    //Get Single Order 
    @Query(() => Order, { name: "getOrder" })
    @UseGuards(AuthGuard)
    getOrder(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.orderService.getOrder(id);
    };

    //Get orders by user
    @Query(() => [Order], { name: "getOrdersByUser" })
    @UseGuards(AuthGuard)
    getOrdersByUser(
        @Context("user") reqUser: ReqUser
    ) {
        return this.orderService.getOrderByUser(reqUser);
    };

    //Get orders by seller
    @Query(() => [OrderBySeller], { name: "getOrdersBySeller" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    getOrdersBySeller(
        @Context("user") reqUser: ReqUser
    ) {
        return this.orderService.getOrderBySeller(reqUser);
    };

    //Get single orders by seller
    @Query(() => OrderBySeller, { name: "getSingleOrderBySeller" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    getSingleBySeller(
        @Args("orderId", { type: () => ID }) orderId: ObjectId,
        @Context("user") reqUser: ReqUser
    ) {
        return this.orderService.getSingleBySeller(orderId, reqUser);
    }

    //Track order
    @Query(() => Order, { name: "trackOrder" })
    track(
        @Args("trackInput") trackInput: TrackInput
    ) {
        return this.orderService.track(trackInput);
    }

    //Add Order
    @Mutation(() => Order, { name: "addOrder" })
    @UseGuards(AuthGuard)
    add(
        @Args("orderInput") orderInput: OrderInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.orderService.add(orderInput, reqUser);
    };

    //Change Order Status by seller
    @Mutation(() => SuccessInfo, { name: "changeOrderStatusBySeller" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    status(
        @Args("id", { type: () => ID }) id: ObjectId,
        @Args("sellerStatusInput") sellerStatusInput: SellerStatusInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.orderService.sellerStatus(sellerStatusInput, id, reqUser);
    };

    //Cancel order status by seller
    @Mutation(() => SuccessInfo, { name: "cancelOrderStatusBySeller" })
    @Roles(Role.SELLER)
    @UseGuards(AuthGuard, RolesGuard)
    cancelBySeller(
        @Args("cancelStatusInput") cancelStatusInput: CancelStatusInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.orderService.cancelBySeller(cancelStatusInput, reqUser);
    }

    //Change status by admin
    @Mutation(() => SuccessInfo, { name: "changeOrderStatusByAdmin" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    statusByAdmin(
        @Args("adminStatusInput") adminStatusInput: AdminStatusInput
    ) {
        return this.orderService.adminStatus(adminStatusInput);
    }

    //Cancel order status by admin
    @Mutation(() => SuccessInfo, { name: "cancelOrderStatusByAdmin" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    cancelByAdmin(
        @Args("cancelStatusInput") cancelStatusInput: CancelStatusInput
    ) {
        return this.orderService.cancelByAdmin(cancelStatusInput);
    }

    //Cancel order status by user
    @Mutation(() => SuccessInfo, { name: "cancelOrderStatusByUser" })
    @UseGuards(AuthGuard)
    cancelByUser(
        @Args("cancelStatusInput") cancelStatusInput: CancelStatusInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.orderService.cancelByUser(cancelStatusInput, reqUser);
    }

    //Change or add Order Notes
    @Mutation(() => SuccessInfo, { name: "orderNote" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    note(
        @Args("id", { type: () => ID }) id: ObjectId,
        @Args("note", { type: () => String }) note: string
    ) {
        return this.orderService.note(note, id);
    };

    //Delete Order list
    @Mutation(() => SuccessInfo, { name: "deleteOrder" })
    @Roles(Role.EDITOR, Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.orderService.delete(id);
    };

    //Resolve field for user in get query
    @ResolveField("user", () => User, { nullable: true })
    getUser(
        @Parent() order: Order,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.userLoader.load(order.user);
    };

    //Resolve field for address in get query
    @ResolveField("shippingAddress", () => Address, { nullable: true })
    getShippingAddress(
        @Parent() order: Order,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.addressLoader.load(order.shippingAddress);
    };

    //Resolve field for address in get query
    @ResolveField("billingAddress", () => Address, { nullable: true })
    getBillingAddress(
        @Parent() order: Order,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.addressLoader.load(order.billingAddress);
    };
}

@Resolver(OrderProductInfo)
export class OrderProductsResolver {
    //Resolve field for product in get query
    @ResolveField("seller", () => Seller, { nullable: true })
    getProduct(
        @Parent() orderProducts: OrderProductInfo,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.sellerLoader.load(orderProducts.seller);
    };
}

@Resolver(SubProductInfo)
export class SubProductsResolver {
    //Resolve field for product in get query
    @ResolveField("product", () => Product, { nullable: true })
    getProduct(
        @Parent() subOrderInfo: SubProductInfo,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.productLoader.load(subOrderInfo.productId);
    };
}

@Resolver(OrderBySeller)
export class OrderBySellerResolver {
    //Resolve field for user in get query
    @ResolveField("user", () => User, { nullable: true })
    getUser(
        @Parent() orderBySeller: OrderBySeller,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.userLoader.load(orderBySeller.user);
    };

    //Resolve field for address in get query
    @ResolveField("shippingAddress", () => Address, { nullable: true })
    getShippingAddress(
        @Parent() orderBySeller: OrderBySeller,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.addressLoader.load(orderBySeller.shippingAddress);
    };

    //Resolve field for address in get query
    @ResolveField("billingAddress", () => Address, { nullable: true })
    getBillingAddress(
        @Parent() orderBySeller: OrderBySeller,
        @Context() { loaders }: IGraphQLContext
    ) {
        return loaders.addressLoader.load(orderBySeller.billingAddress);
    };
}