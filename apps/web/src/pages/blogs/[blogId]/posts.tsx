/* eslint-disable @next/next/no-img-element */
import AppLayout, { Section } from "@/layouts/AppLayout";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageIcon, Plus } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase";
import { toast } from "sonner";
import {
  useDeleteMediaMutation,
  useMediaQuery,
} from "@/components/Images/Images.queries";
import { usePostsQuery } from "@/queries/posts";
import { useBlogQuery } from "@/queries/blogs";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  useDeleteTagMutation,
  useTagsWithUsageQuery,
  useUpdateTagMutation,
} from "@/queries/tags";
import { UpdateTagDialog } from "@/components/Tags/UpdateTagDialog";
import { Image, ImageSelector } from "@/components/Images/ImagePicker";
import { useRouterTabs } from "@/hooks/useRouterTabs";

import { getHostedBlogUrl } from "@/utils/get-hosted-blog-url";

export function StatePill({ published }: { published: boolean }) {
  const text = published ? "Published" : "Draft";
  if (published) {
    return (
      <span className="rounded-md border border-green-200 bg-green-50 px-2 py-1 text-xs font-semibold text-green-500">
        {text}
      </span>
    );
  }
  return (
    <span className="rounded-md border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-500">
      {text}
    </span>
  );
}
export default function BlogPosts() {
  const router = useRouter();
  const blogId = router.query.blogId as string;

  const { tabValue, onTabChange } = useRouterTabs("tab");

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [updateTagDialogOpen, setUpdateTagDialogOpen] = useState(false);
  const [deleteTagDialogOpen, setDeleteTagDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

  const { data: blog, isLoading: blogLoading } = useBlogQuery(blogId);

  const POST_PAGE_SIZE = 10;
  const {
    data: posts,
    isLoading: postsLoading,
    fetchNextPage,
  } = usePostsQuery({
    pageSize: POST_PAGE_SIZE,
  });

  const isLoading = blogLoading || postsLoading;

  const media = useMediaQuery(blogId, {
    enabled: tabValue === "media",
  });
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [selectedTag, setSelectedTag] = useState<{
    tag_id: string | null;
    tag_name: string | null;
    slug: string | null;
  }>();

  const tags = useTagsWithUsageQuery(
    { blogId },
    {
      enabled: tabValue === "tags",
    }
  );

  const supabase = createSupabaseBrowserClient();
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { data, error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (error) {
        throw error;
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deleteTagMutation = useDeleteTagMutation(blogId);
  const updateTagMutation = useUpdateTagMutation(blogId);

  const hostedBlogUrl = getHostedBlogUrl(blog?.slug || "");

  if (blog && posts) {
    return (
      <AppLayout
        loading={isLoading}
        title="Posts"
        actions={
          <>
            <Button asChild>
              <Link href={`/blogs/${blog.id}/create`}>
                <Plus size="16" />
                New post
              </Link>
            </Button>
          </>
        }
      >
        {/* <Tabs
            value={tabValue || "posts"}
            onValueChange={(tabVal) => {
              onTabChange(tabVal);
            }}
          >
            <div className="flex items-center justify-between">
              <TabsList className="w-full items-center">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger onClick={() => {}} value="media">
                  Media
                </TabsTrigger>
                <TabsTrigger onClick={() => {}} value="categories">
                  Categories
                </TabsTrigger>
                <TabsTrigger onClick={() => {}} value="tags">
                  Tags
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => {
                    router.push(`/blogs/${blogId}/settings`);
                  }}
                  value="settings"
                >
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>
           
           
            <TabsContent value="tags">
              <TabSection
                title={tags.data?.length ? `${tags.data?.length} tags` : "Tags"}
                actions={<></>}
              >
                <>
                  {tags.isLoading && (
                    <div className="p-12">
                      <Spinner />
                    </div>
                  )}
                  {tags.data?.length === 0 && (
                    <div className="p-12 py-32 text-center">
                      <div className="text-2xl">🏷️</div>
                      <div className="text-lg text-zinc-500">
                        Nothing here yet
                      </div>
                    </div>
                  )}

                  <div className="grid divide-y">
                    {tags.data?.length ? (
                      <div className="grid grid-cols-4 items-center p-2 text-sm font-medium text-zinc-600">
                        <div>Tag</div>
                        <div>Slug</div>
                        <div className="text-right">Posts with tag</div>
                        <div></div>
                      </div>
                    ) : null}

                    {tags.data?.map((tag) => {
                      return (
                        <div
                          key={tag.tag_id}
                          className="grid grid-cols-4 items-center px-2 py-1.5 hover:bg-zinc-50"
                        >
                          <div className="flex items-center gap-2">
                            <PiTag className="text-orange-500" size="16" />
                            <span className="font-medium">{tag.tag_name}</span>
                          </div>

                          <div className="flex flex-col">
                            <p className="font-mono text-sm text-zinc-500">
                              {tag.slug}
                            </p>
                          </div>

                          <div className="text-right font-mono">
                            {tag.post_count}
                          </div>

                          <div className="flex items-center justify-end">
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant={"ghost"}>
                                  <MoreVertical size="16" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (!tag) {
                                      return;
                                    }
                                    setSelectedTag(tag);
                                    setUpdateTagDialogOpen(true);
                                  }}
                                >
                                  <Pen size="16" className="mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (!tag) {
                                      return;
                                    }
                                    setSelectedTag(tag);
                                    setDeleteTagDialogOpen(true);
                                  }}
                                >
                                  <Trash size="16" className="mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              </TabSection>
            </TabsContent>
            <TabsContent asChild value="categories">
              <TabSection title="Categories" actions={<></>}>
                <CategoriesPage />
              </TabSection>
            </TabsContent>
          </Tabs> */}

        <Section>
          {posts.pages.length === 0 && (
            <div className="p-12 py-32 text-center">
              <div className="text-2xl">✏️</div>
              <div className="text-lg text-zinc-500">Nothing here yet</div>
              <Button asChild>
                <Link
                  href={`/blogs/${blog.id}/create`}
                  className="btn btn-primary mx-auto mt-4 max-w-xs"
                >
                  Publish your first post
                </Link>
              </Button>
            </div>
          )}
          {posts.pages
            .flatMap((page) => page)
            .map((post) => {
              return (
                <PostItem
                  showClicks={true}
                  key={post?.post_id}
                  post={post}
                  blogId={blogId}
                  onDeleteClick={async () => {
                    const confirmed = window.confirm(
                      "Are you sure you want to delete this post?"
                    );
                    if (!confirmed) return;
                    try {
                      await deletePostMutation.mutateAsync(post?.post_id || "");
                      toast.success("Post deleted");
                    } catch (error) {
                      console.error(error);
                      toast.error("Failed to delete post");
                    }
                  }}
                />
              );
            })}
          <div className="flex items-center gap-4 px-3 pt-2 text-center font-mono text-xs text-zinc-500">
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                fetchNextPage();
              }}
            >
              Load more
            </Button>
            Showing {posts.pages.flatMap((page) => page).length} posts
          </div>
        </Section>
      </AppLayout>
    );
  }
}

function PostItem({
  post,
  blogId,
  views,
  onDeleteClick,
  showClicks,
}: {
  post: any;
  blogId: string;
  views?: string;
  onDeleteClick: () => void;
  showClicks?: boolean;
}) {
  return (
    <Link
      key={post.slug}
      href={`/blogs/${blogId}/post/${post.slug}`}
      className="group flex flex-col gap-4 border-b px-3 py-2 transition-all hover:border-zinc-300 md:flex-row md:items-center"
    >
      <div className="hidden h-16 w-24 rounded-md bg-zinc-100 md:block ">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt="Cover image"
            className="h-16 w-24 min-w-24 rounded-md bg-zinc-100 object-cover "
          />
        ) : (
          <div className="flex-center h-full">
            <ImageIcon size="20" className="text-zinc-400" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <h2 className="ml-1 text-lg font-normal text-zinc-700 group-hover:text-zinc-950">
          {post.title}
        </h2>
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2">
            {post.tags?.map((tag: any) => (
              <span
                key={tag}
                className="px-1 py-0.5 font-mono text-xs font-semibold text-zinc-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="ml-auto flex flex-col items-end gap-2 text-xs text-zinc-500">
        <div>
          <StatePill published={post.published || false} />
        </div>
        <span className="font-mono">{formatDate(post.published_at || "")}</span>
      </div>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreVertical size="16" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={async (e) => {
              e.stopPropagation();
              onDeleteClick();
            }}
          >
            <Trash size="16" />
            <span className="ml-2">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </Link>
  );
}
