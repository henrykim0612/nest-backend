import {ChannelChats} from "../../entities/ChannelChats";
import {PickType} from "@nestjs/swagger";

export class PostChartDto extends PickType(ChannelChats, ['content']) {

}