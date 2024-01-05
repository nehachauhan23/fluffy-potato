import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { profileTabs } from "@/constants";

import ThreadsTab from "@/components/shared/ThreadsTab";

import { fetchUser, fetchUserPosts, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import UserCard from "@/components/cards/UserCard";
import Link from "next/link";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // get activities 

  const activity = await getActivity(userInfo._id)

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {
              activity.map((activityData) => (
                <Link key={activityData._id} href={`/thread/${activityData.parentId}`}>
                <article className="activity-card">
                  <div className="flex flex-col gap-2">
                    <Image 
                      src={activityData.author.image}
                      alt="Profile picture"
                      width={20}
                      height={20}
                      className="rounded-full object-contain"
                    />
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {activityData.author.name}
                      </span>{" "}
                      replied to your thread
                    </p>
                  </div>
                </article>
                </Link>
              ))
            }
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </section>
  )
}

export default Page