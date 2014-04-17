class Sparse
  def initialize(dimentions)
    @dimentions = dimentions.sort
    @points = []
  end

  def <<(point)
    @points<< @dimentions.map{|d| point[d] || 0}
  end

  def vote(paragons)
    paragon_pull = paragons.map{|p| p}
    point_count =Array.new(paragons.length,1)
    @points.shuffle.each{|p|
    #Calculate pull factors for each paragon
      pull_factors = paragons.map{|pr| distance(p,pr)}
      mover = paragons[pull_factors.index(pull_factors.min)]
      p "#{p} Moves #{mover} to #{add(paragon_pull[paragons.index(mover)],p,2)} "
      paragon_pull[paragons.index(mover)] = add(paragon_pull[paragons.index(mover)],p,2)#,@points.length)
      point_count[paragons.index(mover)] +=1
    }
    #paragons.map.with_index{|p,i| sub(paragon_pull[i],p,2)}
    p point_count
    paragon_pull.map.with_index{|p,i| add(p,p,2)}
  end
  
  def sub(p1,p2,f=1)#returns a new point/vector
    p1.map.with_index{|c,i| (c - p2[i]).to_f/f}
  end
  
  def add(p1,p2,f=1)
    p1.map.with_index{|c,i| (c+p2[i]).to_f/f}
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
