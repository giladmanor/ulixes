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
  
  def compile
    self.nodes.each{|node| node.compile}
    self.edges.each{|edge| edge.compile}
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
      self.conf[:dimentions_updated] = Time.now
      self.save
    end
    self.conf[:dimentions]
  end
  
  def gmm_dimentions_updated_at
    self.conf[:dimentions_updated]
  end
  
  def user_vectorization
    self.users.find_each({:batch_size=>100}){|user|
      user.vectorize 
    }
  end
  
  def gmm_clusters
    self.clusters.clear
    s = Sparse.new(self.gmm_dimentions)
    self.users.find_each{|user|
      s<<user.vector 
    }
    
    p = s.initiate
    pp=[]
    6.times{|i|
      p "-"*20 + i.to_s
      pp = s.vote(p)
      p = pp
    }
    s.paragon_vector_hash(pp).uniq.each{|v|
      self.clusters << Cluster.new(:vector=>v)  
    }
    
  end
  
  def gmm_clusters_populate
    cluster_list = self.clusters.map{|cluster| cluster}
    self.users.find_each{|u|
      v = cluster_list.map{|c| u.distance(c.vector)}
      p = cluster_list[v.index(v.min)]
      p.users << u
    } 
    to_delete = []
    self.clusters.each{|c| 
      if c.users.size==0
        to_delete << c
      end
    }
    self.clusters.delete(to_delete)
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
      self.conf[:paragons_population] = s.paragon_population(pp)
      self.conf[:paragons] = s.paragon_vector_hash(pp).uniq
      self.save  
    end
    p "-"*20
    p self.conf[:paragons].last
    p "-"*20
    self.conf[:paragons]
  end
  
  def paragon_info(p)
    self.gmm_paragons
    self.conf[:paragons_population].select{|pi| pi[:p]==p}.first
  end  
  
  
end
