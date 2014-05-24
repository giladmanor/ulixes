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
  
  def gmm_dimentions(force=false)
    if force || self.conf[:dimentions].nil?
      self.conf[:dimentions] = Event.where(:user_id=>self.users).uniq.pluck(:code)
      self.save
    end
    self.conf[:dimentions]
  end
  
  def user_vectorization
    self.users.find_each({:batch_size=>100}){|user|
      user.vectorize 
    }
  end
  
  def gmm_paragons(force=false)
    if self.conf[:paragons].nil? || force
      s = Sparse.new(self.gmm_dimentions)
      self.users.find_each{|user|
        s<<user.vector 
      }
      
      p = s.initiate
      pp=[]
      10.times{|i|
        p "-"*20 + i.to_s
        pp = s.vote(p)
        p = pp
      }
      
      self.conf[:paragons] = s.paragon_vector_hash(pp)
      self.save  
    end
    p "-"*20
    p self.conf[:paragons].last
    p "-"*20
    self.conf[:paragons]
  end
    
  
  
end
