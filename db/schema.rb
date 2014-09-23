# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140910093722) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: true do |t|
    t.string   "name"
    t.string   "key"
    t.text     "conf"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "client_key"
  end

  create_table "badges", force: true do |t|
    t.integer  "account_id"
    t.string   "name"
    t.string   "icon"
    t.string   "placeholder"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "badges", ["account_id"], name: "index_badges_on_account_id", using: :btree

  create_table "clusters", force: true do |t|
    t.integer  "account_id"
    t.integer  "parent_id"
    t.string   "name"
    t.boolean  "entrance"
    t.boolean  "engaged"
    t.text     "vector"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "requirement"
  end

  add_index "clusters", ["account_id"], name: "index_clusters_on_account_id", using: :btree

  create_table "delayed_jobs", force: true do |t|
    t.integer  "priority",   default: 0, null: false
    t.integer  "attempts",   default: 0, null: false
    t.text     "handler",                null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree

  create_table "edges", force: true do |t|
    t.integer  "source_id"
    t.integer  "target_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "account_id"
    t.text     "code_cache"
    t.boolean  "expert_mode"
  end

  create_table "events", force: true do |t|
    t.integer  "user_id"
    t.decimal  "value"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "code"
    t.boolean  "flag",       default: false
    t.text     "data"
  end

  add_index "events", ["code"], name: "index_events_on_code", using: :btree
  add_index "events", ["user_id"], name: "index_events_on_user_id", using: :btree

  create_table "languages", force: true do |t|
    t.string   "name"
    t.string   "code"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "account_id"
  end

  create_table "menu_items", force: true do |t|
    t.integer  "account_id"
    t.string   "name"
    t.string   "uri"
    t.text     "args"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "menu_items", ["account_id"], name: "index_menu_items_on_account_id", using: :btree

  create_table "nodes", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "account_id"
    t.text     "data"
    t.text     "code_cache"
    t.boolean  "expert_mode"
  end

  create_table "notifications", force: true do |t|
    t.integer  "account_id"
    t.string   "name"
    t.text     "data"
    t.string   "channel"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "multilang"
    t.string   "format"
    t.string   "frequency"
    t.text     "event_handlers"
    t.text     "bank_policy"
    t.text     "vector"
    t.boolean  "single_response"
  end

  add_index "notifications", ["account_id"], name: "index_notifications_on_account_id", using: :btree

  create_table "roles", force: true do |t|
    t.integer  "account_id"
    t.string   "name"
    t.string   "code"
    t.text     "lock"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "roles", ["account_id"], name: "index_roles_on_account_id", using: :btree

  create_table "rules", force: true do |t|
    t.integer  "account_id"
    t.string   "name"
    t.string   "description"
    t.text     "requirement"
    t.text     "demand"
    t.text     "stats"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "node_id"
    t.integer  "edge_id"
  end

  add_index "rules", ["account_id"], name: "index_rules_on_account_id", using: :btree

  create_table "scales", force: true do |t|
    t.integer  "account_id"
    t.string   "name"
    t.string   "code"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal  "upper_limit"
  end

  add_index "scales", ["account_id"], name: "index_scales_on_account_id", using: :btree

  create_table "user_badges", force: true do |t|
    t.integer  "user_id"
    t.integer  "badge_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_badges", ["badge_id"], name: "index_user_badges_on_badge_id", using: :btree
  add_index "user_badges", ["user_id"], name: "index_user_badges_on_user_id", using: :btree

  create_table "user_notifications", force: true do |t|
    t.integer  "user_id"
    t.integer  "notification_id"
    t.datetime "sent"
    t.datetime "read"
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_notifications", ["notification_id"], name: "index_user_notifications_on_notification_id", using: :btree
  add_index "user_notifications", ["user_id"], name: "index_user_notifications_on_user_id", using: :btree

  create_table "user_scores", force: true do |t|
    t.integer  "user_id"
    t.integer  "scale_id"
    t.decimal  "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_scores", ["scale_id"], name: "index_user_scores_on_scale_id", using: :btree
  add_index "user_scores", ["user_id"], name: "index_user_scores_on_user_id", using: :btree

  create_table "users", force: true do |t|
    t.integer  "account_id"
    t.string   "uid"
    t.string   "login"
    t.string   "password"
    t.integer  "role_id"
    t.integer  "parent_id"
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "node_id"
    t.string   "local"
    t.integer  "cluster_id"
  end

  add_index "users", ["account_id"], name: "index_users_on_account_id", using: :btree
  add_index "users", ["cluster_id"], name: "user_in_cluster", using: :btree
  add_index "users", ["role_id"], name: "index_users_on_role_id", using: :btree

  create_table "zero_sum_game_users", force: true do |t|
    t.integer  "zero_sum_game_id"
    t.integer  "user_id"
    t.string   "group"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "zero_sum_game_users", ["user_id"], name: "index_zero_sum_game_users_on_user_id", using: :btree
  add_index "zero_sum_game_users", ["zero_sum_game_id"], name: "index_zero_sum_game_users_on_zero_sum_game_id", using: :btree

  create_table "zero_sum_games", force: true do |t|
    t.integer  "account_id"
    t.string   "name"
    t.text     "resources"
    t.text     "conf"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "zero_sum_games", ["account_id"], name: "index_zero_sum_games_on_account_id", using: :btree

end
