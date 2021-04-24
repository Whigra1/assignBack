import {CacheInterceptor, Controller, Get, HttpException, Inject, Param, UseInterceptors} from "@nestjs/common";
import {DatabaseService} from "./database.service";
import {ApiOkResponse, ApiResponse, ApiTags} from "@nestjs/swagger";
import ContractConnector from "../web3/ContractConnector";

@ApiTags('assign')
@UseInterceptors(CacheInterceptor)
@Controller()
export class DatabaseController {
    constructor(private readonly databaseService: DatabaseService) {}
    contractConnector = new ContractConnector()

    @ApiResponse({ status: 200, description: "Returned group ids" })
    @ApiResponse({ status: 400, description: "Ids not found in DB" })
    @Get("group-ids")
    GetGroupIds(): Promise<string> {
        return this.databaseService.GetGroupIds();
    }

    @ApiResponse({ status: 200, description: "Returned group" })
    @ApiResponse({ status: 404, description: "Group not found in DB" })
    @Get("group/:id")
    GetGroup(@Param('id') id:number): Promise<string> {
        if (isNaN(id)) {
            throw new HttpException('Invalid input', 400)
        }
        return this.databaseService.GetGroup(Number(id));
    }

    @ApiResponse({ status: 200, description: "Returned Index" })
    @ApiResponse({ status: 404, description: "Index not found in DB" })
    @Get("index/:indexId")
    GetIndex(@Param('indexId') indexId: number): Promise<string> {
        return this.databaseService.GetIndex(indexId);
    }

    @ApiResponse({ status: 200, description: "Returned last-block" })
    @ApiResponse({ status: 404, description: "Index not found in DB" })
    @Get("last-block")
    GetBlock(): Promise<string> {
        return this.databaseService.GetBlock();
    }

    @Get("last-block-raw")
    GetBlock1(): Promise<string> {
        return this.contractConnector.GetBlock();
    }
}
