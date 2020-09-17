enum ModifyActions {
  Add = 'add',
  Archive = 'archive',
  ReAdd = 'readd',
  Favorite = 'favorite',
  Unfavorite = 'unfavorite',
  Delete = 'delete',
  TagsAdd = 'tags_add',
  TagsRemove = 'tags_remove',
  TagsReplace = 'tags_replace',
  TagsClear = 'tags_clear',
  TagRename = 'tag_rename',
  TagDelete = 'tag_delete'
}

type Action = {
  action: ModifyActions,
  item_id: string,
  time?: number
}

interface ModifyOptions {
  actions: Action[]
}

export {
  ModifyActions,
  ModifyOptions,
  Action
}
