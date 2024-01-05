import ThreadCard from "@/components/cards/ThreadCard"
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import Comment from "@/components/forms/Comment";

const page = async({ params } : { params: { id: string}}) => {
  
  console.log("params id is : ", params.id);
  
  if(!params.id) return null

  const user = await currentUser();
  
  console.log(" user fetched in the single thread page : ", user);
  
  
  if(!user) return null
  

  const userInfo = await fetchUser(user.id)

  console.log("userinfo in the single thread: ", userInfo);
  
  if(!userInfo?.onboarded) redirect('/onboarding')

  const thread = await fetchThreadById(params.id)
  
  console.log("thread : ", thread);
  
  return (
    <section className="relative">
      <div>
      <ThreadCard 
        key={thread._id} 
        id={thread._id} 
        currentUserId={user?.id || ""}
        parentId={thread.parentId}
        content={thread.text}
        author={thread.author}
        community={thread.community}
        createdAt={thread.createdAt}
        comments={thread.children}
      />
      </div>
      <div className="mt-7">
        <Comment
          threadId={thread.id}
          currentUserImg={userInfo.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
          
        />
      </div>
      <div className="mt-10">
        {thread.children.map((childItem: any) =>(
          <ThreadCard 
            key={childItem._id} 
            id={childItem._id} 
            currentUserId={user?.id || ""}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  )
}

export default page