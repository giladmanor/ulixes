# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
account = Account.create({name:"Initial Test Account", key:"a"})

role_lock = [
    {:name=>"Account", :items=>[{:name=>"Roles", :uri=>"/list/role"}]},
    {:name=>"PBL", :items=>[{:name=>"Badges", :uri=>"/grid/badge"},{:name=>"Scales", :uri=>"/list/scale"}]},  
    {:name=>"Graph", :items=>[{:name=>"Rules", :uri=>"/graph/index"}]}, 
    {:name=>"Editors", :items=>[{:name=>"Mock-up", :uri=>"/mockup/index"}, {:name=>"Notifications", :uri=>"/list/notification"}]}
  ]

role = Role.create({account: account, name: "tech", code: "tech", lock: role_lock})
User.create({ account: account, role: role, uid: nil, login: "a", password: "a"})
