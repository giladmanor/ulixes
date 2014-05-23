# GMM sparse model for hump hunting
class Sparse
  
  # initialize the sparse model with a list of available dimention names
  def initialize(dimentions)
    @dimentions = dimentions.sort
    @points = []
  end

  # Add a point i.e. {:a=>1, :b=>2} to the model
  def <<(point)
    @points<< @dimentions.map{|d| point[d] || 0}
  end
  
  #initiate the controller points
  def initiate
    maxd = Array.new(@dimentions.length,0)
    points.each{|p|
      maxd = p.map.with_index{|c,i| c>maxd[i] ? c : maxd[i]}
    }
    res = [Array.new(@dimentions.length,0)]
    maxd.each.with_index{|p,i| 
      res<<(maxd.map.with_index{|c,j| i==j ? c : 0} )
    }
    res
  end

  # given a set of controller points, and a populated sparse model, will return a new set of points that are closer to humps  
  def vote(paragons)
    paragon_pull = paragons.map{|p| p}
    point_count =Array.new(paragons.length,1)
    mover_index = []
    @points.each{|p|
      #Calculate pull factors for each paragon
      pull_factors = paragons.map{|pr| distance(p,pr)}
      
      mover_index = pull_factors.index(pull_factors.min)
      mover = paragons[mover_index]
      
      paragon_pull[mover_index] = add(paragon_pull[mover_index],p)#,@points.length)
      point_count[mover_index] +=1
    }
    paragon_pull.map.with_index{|p,i| div(p,point_count[i])}
  end
  
  # given a set of paragon points, will remove all unpopulated paragons
  def clean_empty_paragons(paragons)
    point_count =Array.new(paragons.length,0)
    @points.each{|p|
      pull_factors = paragons.map{|pr| distance(p,pr)}
      mover_index = pull_factors.index(pull_factors.min)
      point_count[mover_index] +=1
    }
    paragons.delete_if.with_index{|p,i| point_count[i]==0}
  end
  
  def paragon_population(paragons)
    point_count =Array.new(paragons.length,0)
    @points.each{|p|
      pull_factors = paragons.map{|pr| distance(p,pr)}
      mover_index = pull_factors.index(pull_factors.min)
      point_count[mover_index] +=1
    }
    res = paragons#.delete_if.with_index{|p,i| point_count[i]==0}
    p res
    res.map.with_index{|p,i| {:name=>i,:p=>p,:value=>point_count[i]}}.delete_if{|p| p[:value]==0}
  end
  
  def paragon_vector_hash(paragons)
    res = paragons.map{|p| 
      v = {}
      @dimentions.each.with_index{|d,i|
        v[d]=p[i]
      }
      v
    }
  end
  
  def add(p1,p2,f=1)
    p1.map.with_index{|c,i| (c+p2[i]).to_f/f}
  end
  
  def div(p,f)
    p.map{|c| c.to_f/f}
  end
  
  def sub(p1,p2,f=1)#returns a new point/vector
    p1.map.with_index{|c,i| (c - p2[i]).to_f/f}
  end
  
  def move(p1,p2,f)
    add(p2,sub(p1,p2,f))
  end

  def distance(p1,p2)#return scalar
    res = 0
    p1.each.with_index{|c,i| res += ((c-p2[i])**2)}
    #p res
    Math.sqrt res
  end

  def to_s
    @points.map{|p| "<#{p.join("|")}>"}.join("\n")
  end
  
  def points
    @points
  end

  
  def self.read(file_name)
    #p "Reasing vector file #{file_name}"
    r = File.open(file_name,"rb" )
    dimentions = r.gets.gsub("\r\n","").split(",")
    #p "loaded dimentions #{dimentions.inspect}"
    s = Sparse.new(dimentions)
    
    while line = r.gets#.gsub("\r\n","")
      #p "adding #{line}"
      s<<ActiveSupport::JSON.decode(line)
    end
    r.close
    
    s
  end

end

# GMM: http://web.iitd.ac.in/~sumeet/GMM_said_crv10_tutorial.pdf
