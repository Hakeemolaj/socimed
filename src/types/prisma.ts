// Define interfaces directly instead of extending from Prisma types
export interface FriendWithRelations {
  id: string;
  userId: string;
  friendId: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  friend: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface FriendRequestWithSender {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface FormattedFriend {
  id: string;
  userId: string;
  name: string;
  image: string;
}

export interface FormattedFriendRequest {
  id: string;
  userId: string;
  name: string;
  image: string;
} 