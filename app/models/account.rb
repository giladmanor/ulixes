class Account < ActiveRecord::Base
  serialize :conf, Hash
  has_many :clusters
  has_many :badges
  has_many :menu_items
  has_many :roles
  has_many :rules
  has_many :scales
  has_many :users
  has_many :nodes
  has_many :edges
  has_many :notifications
  has_many :languages
  
  def find_user(uid)
    user = self.users.find_by_uid(uid)
    if user.nil? && self.conf[:on_the_fly]
      user = User.new(:uid=>uid, :account=>self, :node=>self.nodes.find(self.conf[:graph_entry_point]))
      self.users<<user
    end
    user
  end
  
  
  def vector_file(n)
    out = File.open("#{n}.txt","wb" )
    self.users.each{|u| 
      out.puts(u.vector.to_json)
      u=nil
      }
    out.close
  end
  
end
