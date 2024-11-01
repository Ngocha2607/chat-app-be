import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
      },
    ],
    required: true,
  })
  participants: Types.ObjectId[];

  @Prop({
    type: [
      {
        sender: {
          type: MongooseSchema.Types.ObjectId,
          ref: 'User',
        },
        content: String,
        timestamp: Date,
      },
    ],
    default: [],
  })
  messages: { sender: Types.ObjectId; content: string; timestamp: Date }[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'File' }],
    default: [],
  })
  files: Types.ObjectId[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
